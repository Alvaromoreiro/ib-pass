import { Injectable } from '@angular/core';
import { BookingHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import { BaseServiceConfigJson } from 'ib-web-commons/proxies';
import { lastValueFrom } from 'rxjs';
import { BookingRxProxy } from './ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error/ib-booking-error-handler.service';
import { downgradeToAJSService } from 'ib-web-commons/utils';


@Injectable({providedIn: 'root'})
export class BookingPromiseProxy {
    
    constructor (
        private rxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }


    /**
     * Performs an HTTP GET request and returns a Promise
     * @param url Endpoint URL
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async get<T = unknown>(url: string, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {       
        return await lastValueFrom(this.rxProxy.get<T>(url, config).pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));       
    }

    /**
     * Performs an HTTP POST request and returns a Promise
     * @param url Endpoint URL
     * @param data Data to send in the request body
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async post<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxProxy.post<T>(url, data, config).pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));   
    }

    /**
     * Performs an HTTP PUT request and returns a Promise
     * @param url Endpoint URL
     * @param data Data to send in the request body
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async put<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {        
        return await lastValueFrom(this.rxProxy.put<T>(url, data, config).pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));      
    }

    /**
     * Performs an HTTP DELETE request and returns a Promise
     * @param url Endpoint URL
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async delete<T = unknown>(url: string, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {   
        return await lastValueFrom(this.rxProxy.delete<T>(url, config).pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));    
    }

    /**
     * Performs an HTTP PATCH request and returns a Promise
     * @param url Endpoint URL
     * @param data Data to send in the request body
     * @param config Optional service configuration
     * @returns Promise with HTTP response or throws custom error
     */
    async patch<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Promise<BookingHttpResponse<T>> {
        return await lastValueFrom(this.rxProxy.patch<T>(url, data, config).pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));
    }
}
downgradeToAJSService('BookingPromiseProxy', BookingPromiseProxy, 'ib-http-services-module', ['ib-interceptors-module']);
