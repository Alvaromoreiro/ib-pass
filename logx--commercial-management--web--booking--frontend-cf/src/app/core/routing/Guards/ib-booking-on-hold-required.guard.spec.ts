import { TestBed } from '@angular/core/testing';
import { BookingOnHoldConfirmationRequiredGuardFn } from '@src/app/core/routing/Guards/ib-booking-on-hold-required.guard';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { OnHoldComponentRequirements } from '@core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { BookingModalServiceType, AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingModalServiceMock } from 'test/mocks/Services/BookingModalServiceMock';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { getRedirectionPath, RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { IbBookingRetrieveOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-retrieve-order.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

class fakeBookingUtilService {
    initStorage = jasmine.createSpy('initStorage');
    getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake((paramName) => {
        if(paramName === BookingAppConstants.BOOKING_PARAMS_NAMES.PNR){
            return 'PNR';
        } else if(paramName === BookingAppConstants.BOOKING_PARAMS_NAMES.SURNAME){
            return 'surname';
        } else return null;
    });
}
class fakeIbBookingRetrieveOrderService {
    retrieveOrder = jasmine.createSpy('retrieveOrder').and.returnValue(Promise.resolve({ test: 'test' }));
}

class TestBench {
    public Guard: ResolveFn<OnHoldComponentRequirements>;
    public CommonsSessionStorageService: CommonsSessionStorageService = new StorageServiceMock() as any;
    public BookingRedirectionService: BookingRedirectionService = jasmine.createSpyObj('BookingRedirectionService', ['path']);
    public modalService: BookingModalServiceType = new BookingModalServiceMock()as unknown as BookingModalServiceType;
    public bookingUtilService = new fakeBookingUtilService();
    public ibBookingRetrieveOrderService = new fakeIbBookingRetrieveOrderService();
    constructor () {
        this.Guard = ( route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot)=> TestBed.runInInjectionContext(() => BookingOnHoldConfirmationRequiredGuardFn(route, state) as Promise<OnHoldComponentRequirements>);
        TestBed.configureTestingModule({
            providers: [
                { provide: CommonsSessionStorageService, useValue: this.CommonsSessionStorageService },
                { provide: BookingRedirectionService, useValue: this.BookingRedirectionService },
                { provide: AJSBookingModalService, useValue: this.modalService },
                { provide: AJSBookingUtilsService, useValue: this.bookingUtilService },
                { provide: IbBookingRetrieveOrderService, useValue: this.ibBookingRetrieveOrderService }
            ]
        });
    }

    public testCaseImportOrderFound = async (importOrderSeted) => {
        const response = await this.Guard(null, null) as OnHoldComponentRequirements;
        expect(this.bookingUtilService.initStorage).toHaveBeenCalled();
        expect(this.modalService.showWaitingModal).toHaveBeenCalled();
        expect(this.BookingRedirectionService.path).not.toHaveBeenCalled();
        expect(response.importOrderData).toEqual(importOrderSeted);
    };
    public testCaseImportOrdeNotFound = async () => {
        try{
            await this.Guard(null, null);
        } catch (response) {
            expect(this.bookingUtilService.initStorage).not.toHaveBeenCalled();
            expect(this.modalService.showWaitingModal).toHaveBeenCalled();
            expect(this.BookingRedirectionService.path).toHaveBeenCalledWith(getRedirectionPath(RouterPathsConstants.ibbkerror));
            expect(response).toEqual(null);
        }
    };

    public testCaseRetrieveOrderFromService = async (importOrder) => {
        const response = await this.Guard(null, null) as OnHoldComponentRequirements;
        expect(this.ibBookingRetrieveOrderService.retrieveOrder).toHaveBeenCalledWith('surname', 'PNR');
        expect(this.bookingUtilService.initStorage).toHaveBeenCalled();
        expect(this.modalService.showWaitingModal).toHaveBeenCalled();
        expect(this.BookingRedirectionService.path).not.toHaveBeenCalled();
        expect(response.importOrderData).toEqual(importOrder);
    };
}
describe('Test BookingOnHoldRequiredGuardFn', () => {
    let testBench: TestBench;
    // Instanciate guard and module just once
    beforeEach(() => {
        sessionStorage.clear();
        testBench = new TestBench();
    });
    it('should return OnHoldComponentRequirements when there is an import order from mmb', async () => {
        const { testCaseImportOrderFound } = testBench;
        const importOrder = { test: 'test',  warnings:[]} as any;
        sessionStorage.setItem('ib-MmB-app.importOrder', JSON.stringify(importOrder));
        await testCaseImportOrderFound( importOrder);
    });
    it('should return OnHoldComponentRequirements when there is an import order from BKI', async () => {
        const { testCaseImportOrderFound, CommonsSessionStorageService } = testBench;
        const importOrder = { test: 'test', warnings:[] } as any;
        CommonsSessionStorageService.set(BkiStorageConstants.IMPORT_ORDER, importOrder);
        await testCaseImportOrderFound( importOrder);
    });
    it('should return OnHoldComponentRequirements when it called importOrder service', async () => {
        const { testCaseImportOrderFound } = testBench;
        const importOrder = { test: 'test', warnings:[] } as any;
        await testCaseImportOrderFound( importOrder);
    });
    it('should throw error when importOrder service fails', async () => {
        const { testCaseImportOrdeNotFound, bookingUtilService } = testBench;
        bookingUtilService.getURLFirstParameterByName.and.returnValue(null);
        await testCaseImportOrdeNotFound();
    });
    it('should return null when there is no import order', async () => {
        const { testCaseImportOrdeNotFound } = testBench;
        await testCaseImportOrdeNotFound();
    });
    it('should retrieve order from service using URL parameters when no stored order exists', async () => {
        const { testCaseRetrieveOrderFromService } = testBench;
        const importOrder = { test: 'test', warnings:[] } as any;
        await testCaseRetrieveOrderFromService( importOrder);
    });
    it('should extract order data from existing order object', async () => {
        const { testCaseImportOrderFound, CommonsSessionStorageService, ibBookingRetrieveOrderService } = testBench;
        
        const importOrder = {
            test: 'test',
            warnings:[],
            passengers: [
                {
                    personalInfo: {
                        surname: 'TestSurname'
                    }
                }
            ],
            order: {
                bookingReferences: [
                    {
                        reference: 'ABC123'
                    }
                ]
            }
        } as any;
        CommonsSessionStorageService.set(BkiStorageConstants.IMPORT_ORDER, importOrder);
        CommonsSessionStorageService.set(BkiStorageConstants.PREVIOUS_STEP_FLOW, RouterPathsConstants.ibpurc);
        ibBookingRetrieveOrderService.retrieveOrder.and.returnValue(Promise.resolve(importOrder));
        await testCaseImportOrderFound(importOrder);
    });    
});
