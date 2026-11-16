import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { BkiStorageConstants } from './ib-booking-route-preconditions.guard';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { RouterPathsConstants, getRedirectionPath } from '../../constants/ib-booking-router-paths-constants';
import { BookingModalServiceType, AJSBookingModalService } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { OHImportResponse, OnHoldComponentRequirements } from '../../models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { BookingAppConstants } from '../../constants/ib-booking-constants';
import { IbBookingRetrieveOrderService } from '@shared/http-services/sse-orm/ib-booking-retrieve-order.service';

const retrieveImportOrder = async (): Promise<OHImportResponse> => {
    const storage: CommonsSessionStorageService  = inject(CommonsSessionStorageService);
    const bookingUtilService = inject<any>(AJSBookingUtilsService);
    let importOrder: OHImportResponse = JSON.parse(sessionStorage.getItem('ib-MmB-app.importOrder')) ?? storage.get(BkiStorageConstants.IMPORT_ORDER);
    if ( !importOrder || storage.get(BkiStorageConstants.PREVIOUS_STEP_FLOW) === RouterPathsConstants.ibpurc )  {
        importOrder = await callImportOrder(importOrder);
    }
    importOrder = filterWarnings(importOrder);
    bookingUtilService.initStorage();
    storage.set(BkiStorageConstants.IMPORT_ORDER, importOrder);

    // Set compatibility storage
    storage.set(BkiStorageConstants.BKI_INFO, importOrder);
    storage.set(BkiStorageConstants.CREATE_ORDER_DATA, importOrder);
    storage.set(BkiStorageConstants.FLOW_APP, 'MMBOH');
    
    return importOrder;
};

const getOrderSearchParams = (order?: OHImportResponse): {surname: string, locator: string} => {
    const bookingUtilService = inject<any>(AJSBookingUtilsService);
    let surname: string = '';
    let locator: string = '';
    
    if (order) {
        surname = order.passengers?.[0].personalInfo.surname ?? '';
        locator = order.order.bookingReferences[0].reference ?? '';

    } else {
        locator = bookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.PNR);
        surname = bookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.SURNAME);
    }
    return {surname, locator};
};

const callImportOrder = async (order?: OHImportResponse):Promise<OHImportResponse> =>{

    const ibBookingRetrieveOrderService = inject(IbBookingRetrieveOrderService);
    const getOrderSearchParamsResult = getOrderSearchParams(order);
    const locator = getOrderSearchParamsResult.locator;
    const surname = getOrderSearchParamsResult.surname;
    if(locator && surname){
        return await ibBookingRetrieveOrderService.retrieveOrder(surname, locator);     
    } else {
        // Generate error in case no import order is found
        throw new Error('No import order found');
    }
};

const filterWarnings = (importOrder: OHImportResponse) => {
    let warnings = importOrder.warnings;
    let filteredImportOrder =
    {
        ...importOrder,
        warnings: warnings ? warnings.filter(warn => warn.code === 'SSE_MBM_1011') : []
    };
    return filteredImportOrder;
};

export const BookingOnHoldConfirmationRequiredGuardFn: ResolveFn<OnHoldComponentRequirements> = async ( route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Promise<OnHoldComponentRequirements> => {
    
    const redirectionService:BookingRedirectionService = inject(BookingRedirectionService);
    const modalService = inject<BookingModalServiceType>(AJSBookingModalService);
    // Show loading modal
    modalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
    try {
        let importOrderData: OHImportResponse =  await retrieveImportOrder();
        return { importOrderData };

    } catch (error) {
        return new Promise<OnHoldComponentRequirements>((resolve, reject) => {
            redirectionService.path(getRedirectionPath(RouterPathsConstants.ibbkerror));
            setTimeout(() => {
                modalService.finishWaiting();
                reject(null);
            } );
        });
    }
    
};