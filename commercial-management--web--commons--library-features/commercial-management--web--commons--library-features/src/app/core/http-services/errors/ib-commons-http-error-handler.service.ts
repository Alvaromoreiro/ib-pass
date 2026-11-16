import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonsConstants } from "ib-web-commons/constants";
import {
  AglResponseError,
  DefaultResponseError,
  GeneralResponseError,
  ProcessedHttpErrorInfo,
} from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbCHttpErrorHandlerService {
  /**
   * Map error service reason response to new message that needs to be translated. Extend the class and override this
   * to the need.
   * @protected
   */
  protected errorMessageMap = {
    [CommonsConstants.BOOKINGERRORSSERVICE.PAC_UTILS_E0001]:
      CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR,
  };

  /**
   * @description A RXJS custom pipeable operator to handle http errors with the Iberia standard. This has some error
   * tools but if needed to add a custom handlingError to many httpServices. This MUST be extended and add the logic properly.
   * @param errorControl Optional. An array of all status code that has to be controlled by the handle error, if available.
   * By default, it controls all declared.
   * @example
   * this.httpProxy.get<string>('url').pipe(this.httpErrorHandlerService.handleErrorOperator());
   * this.httpProxy.get<string>('url').pipe(this.httpErrorHandlerService.handleErrorOperator([400, 401, 403])); // Only controls defined status code
   */
  handleErrorOperator<T>(
    errorControl?: number[],
  ): (source: Observable<T>) => Observable<T> {
    return (source) =>
      source.pipe(
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse) {
            return this.handleError(error, errorControl);
          }
          return throwError(() => error);
        }),
      );
  }

  /**
   * Handle error internal map for handling errors, you can add custom
   * @param error Server error response
   * @param errorControl Array of controlled errors status, if a status is not in the array defaults to generic handling.
   */
  protected handleError(
    error: HttpErrorResponse,
    errorControl?: number[],
  ): Observable<never> {
    const statusFunctionName =
      !errorControl || errorControl?.includes(error.status)
        ? (`onError${error.status}` as keyof this)
        : ("handleGenericError" as keyof this);
    return (
      (
        this[statusFunctionName] as unknown as (
          error: HttpErrorResponse,
        ) => Observable<never>
      )?.(error) ?? this.handleGenericError(error)
    );
  }

  /**
   * @description Generic handling error for promises. Only rejects the error by default, because all common error handling
   * is done by the interceptor, if more logic is needed extend the class and reimplement this method
   * @param error The error thrown in the application.
   * @param reject The promise rejection.
   * By default, it controls all declared.
   */
  handlePromiseError(error: unknown, reject: (reason?: unknown) => void) {
    reject(error);
  }

  /**
   * @description Get the error message in a way to be more readable to show it to the user or other.
   * @param error The server error.
   */
  getErrorMessage(error: unknown): ProcessedHttpErrorInfo[] {
    const controlError: unknown =
      error instanceof HttpErrorResponse ? error.error : error;
    if (this.isTypeGeneralResponseError(controlError)) {
      return controlError.errors.map((resp) => {
        const changedMessage = this.errorMessageMap[resp.code];
        return {
          message:
            changedMessage ??
            this.getSelectedReason(resp.reason) ??
            CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR,
          needsTranslate: Boolean(changedMessage || !resp.reason),
          internalErrorCode: resp.code ?? "",
        };
      });
    }
    if (this.isTypeDefaultResponseError(controlError)) {
      return [
        {
          message: controlError.error_description,
          internalErrorCode: controlError.error,
          needsTranslate: false,
        },
      ];
    }
    if (this.isTypeAglResponseError(controlError)) {
      if (controlError.childError) {
        return controlError.childError?.map((resp) => {
          return {
            message: resp.businessMessage,
            needsTranslate: false,
            internalErrorCode: resp.code,
          };
        });
      }
      return [
        {
          message: controlError.businessMessage,
          needsTranslate: false,
          internalErrorCode: controlError.code,
        },
      ];
    }
    return [
      {
        message: CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR,
        internalErrorCode: "",
        needsTranslate: true,
      },
    ];
  }

  /**
   * Get only the important message from the error reason returned from server, it is has a reason.
   * @param reason
   * @private
   */
  private getSelectedReason(reason: string | undefined): string | undefined {
    if (!reason) return undefined;
    const errorMessageRegex =
      CommonsConstants.commonsPatterns.ERROR_PATTERN_WITH_PROPERTIES;
    if (errorMessageRegex.test(reason)) {
      const reasonParameters = reason.split("|");
      return reasonParameters?.[1]?.split(":")[1]?.trim();
    }
    return reason;
  }

  /**
   * Handle errors 400. THIS IS A FILLER, you should need to extend this class to add handle logic.
   * You can add more onError[StatusCode] to you error handling needs.
   * @param error
   */
  protected onError400(error: HttpErrorResponse) {
    return this.handleGenericError(error);
  }

  /**
   * Handle errors 404. THIS IS A FILLER, you should need to extend this class to add handle logic
   * You can add more onError[StatusCode] to you error handling needs.
   * @param error
   */
  protected onError404(error: HttpErrorResponse) {
    return this.handleGenericError(error);
  }

  /**
   * Handle errors 412. THIS IS A FILLER, you should need to extend this class to add handle logic
   * You can add more onError[StatusCode] to you error handling needs.
   * @param error
   */
  protected onError412(error: HttpErrorResponse) {
    return this.handleGenericError(error);
  }

  /**
   * @description The generic handling for errors. Normally, only a re throw of the http error is needed.
   * @param error
   */
  protected handleGenericError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  /**
   * The errors thrown in the application are always unknowns, because we are not always certain if the error is from
   * the server or code. This method checks the typing for typescript, and if you check with this method an unknown error
   * it resolves the typing causing no compilation errors.
   * @param error
   */
  isTypeGeneralResponseError(error: unknown): error is GeneralResponseError {
    const errorExpected = error as GeneralResponseError;
    return (
      errorExpected.errors?.length > 0 && Boolean(errorExpected.errors[0].code)
    );
  }

  /**
   * The errors thrown in the application are always unknowns, because we are not always certain if the error is from
   * the server or code. This method checks the typing for typescript, and if you check with this method an unknown error
   * it resolves the typing causing no compilation errors.
   * @param error
   */
  isTypeDefaultResponseError(error: unknown): error is DefaultResponseError {
    const errorExpected = error as DefaultResponseError;
    return Boolean(errorExpected.error && errorExpected.error_description);
  }

  /**
   * The errors thrown in the application are always unknowns, because we are not always certain if the error is from
   * the server or code. This method checks the typing for typescript, and if you check with this method an unknown error
   * it resolves the typing causing no compilation errors.
   * @param error
   */
  isTypeAglResponseError(error: unknown): error is AglResponseError {
    const errorExpected = error as AglResponseError;
    return Boolean(errorExpected.code && errorExpected.childError);
  }
}
