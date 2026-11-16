import { Injectable } from '@angular/core';
import { BookingHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import { BaseServiceConfigJson } from 'ib-web-commons/proxies';
import { lastValueFrom } from 'rxjs';
import { BookingSalesforceRxProxy } from './ib-booking-salesforce-rx-proxy.service';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';


@Injectable({providedIn: 'root'})
export class BookingPromiseSalesforceProxy {
    
    constructor (
        private rxSalesForceProxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }


    
    /**
     * Performs an HTTP GET request and returns a Promise
     * @param url Endpoint URL
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async get<T = unknown>(url: string, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxSalesForceProxy.get<T>(url, config).pipe(  this.IbBookingErrorHandlerService.handleErrorOperator()));

    }

    /**
     * Performs an HTTP POST request and returns a Promise
     * @param url Endpoint URL
     * @param data Data to send in the request body
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async post<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxSalesForceProxy.post<T>(url, data, config).pipe(  this.IbBookingErrorHandlerService.handleErrorOperator()));

    }

    /**
     * Performs an HTTP PUT request and returns a Promise
     * @param url Endpoint URL
     * @param data Data to send in the request body
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async put<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxSalesForceProxy.put<T>(url, data, config).pipe(  this.IbBookingErrorHandlerService.handleErrorOperator()));

    }

    /**
     * Performs an HTTP DELETE request and returns a Promise
     * @param url Endpoint URL
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async delete<T = unknown>(url: string, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxSalesForceProxy.delete<T>(url, config).pipe(  this.IbBookingErrorHandlerService.handleErrorOperator()));

    }

    /**
     * Performs an HTTP PATCH request and returns a Promise
     * @param url Endpoint URL
     * @param data Data to send in the request body
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async patch<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxSalesForceProxy.patch<T>(url, data, config).pipe(  this.IbBookingErrorHandlerService.handleErrorOperator()));

    }
}
downgradeToAJSService('BookingPromiseSalesforceProxy', BookingPromiseSalesforceProxy, 'ib-http-services-module', ['ib-interceptors-module']);
