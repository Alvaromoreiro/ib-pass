import { TestBed } from '@angular/core/testing';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { OnPaymentSuccessEvent } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';
import { VoucherDiscountOrder } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { IbBookingPmtDigitalDataService } from '@src/app/pages/ib-booking-payments-page/components/ib-booking-pmt-component/services/ib-booking-pmt-digital-data.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { DatalayerUtilsServiceMock } from 'test/mocks/class/DatalayerUtilsServiceMock';
import { DigitalDataUtilsServiceMock } from 'test/mocks/class/DigitalDataUtilsServiceMock';
import { DigitalDataServiceMock } from 'test/mocks/class/DigitalDataServiceMock';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { DigitalDataProcess } from '@src/app/core/constants/ib-digital-data-constants';

let fakeAJSDatalayerUtilsService: DatalayerUtilsServiceMock;
let fakeDigitalDataService: DigitalDataServiceMock;
let fakeDigitalDataUtilsService: DigitalDataUtilsServiceMock;
describe('IbBookingPmtDigitalDataService Test', () => {
    let service: IbBookingPmtDigitalDataService;
    let fakeSessionStorageService: StorageServiceMock = new StorageServiceMock();
    fakeAJSDatalayerUtilsService = new DatalayerUtilsServiceMock();
    beforeEach( async () => {
        fakeDigitalDataService = new DigitalDataServiceMock();
        fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        TestBed.configureTestingModule( {
            providers: [
                IbBookingPmtDigitalDataService,
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorageService },
                { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService },
                { provide: DigitalDataService, useValue: fakeDigitalDataService },
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService }
            ]
        } );
        service = TestBed.inject( IbBookingPmtDigitalDataService );
    } );
    describe( 'When emitViewEvent is called', () => {
        it( 'it should call the provider service method', () => {
            service.emitViewEvent();
            expect( fakeDigitalDataService.emitViewEvent ).toHaveBeenCalled();
        } );
    } );
    describe( 'When addDigitalDataInfo is called', () => {
        it( 'it should call the provider service method ', () => {
            service.addDigitalDataInfo( {} );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalledWith( {} );
        } );
    } );
    describe( 'When getDigitalData is called', () => {
        it( 'it should return the data from provider method', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( {} );
            const dd = service.getDigitalData();
            expect( dd ).toEqual( {} );
        } );
    } );
    describe( 'When getDigitalDataProcess is called', () => {
        it( 'it should return the process key value', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( { 'Process': 'process' } );
            const dd_process = service.getDigitalDataProcess();
            expect( dd_process ).toEqual( 'process' );
        } );
        it( 'it should return if no digital_data', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( null );
            const dd_process = service.getDigitalDataProcess();
            expect( dd_process ).toEqual( undefined );
        });
    } );
    describe( 'When getDigitalDataQuadrigam is called', () => {
        it( 'it should return the quadrigam key value', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( { 'Quadrigam': 'quadrigam' } );
            const dd_quadrigam = service.getDigitalDataQuadrigam();
            expect( dd_quadrigam ).toEqual( 'quadrigam' );
        } );
        it( 'it should return if no digital_data', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( null );
            const dd_quadrigam = service.getDigitalDataQuadrigam();
            expect( dd_quadrigam ).toEqual( undefined );
        });
    } );
    describe( 'When setPaymentsDigitalData is called', () => {
        it( 'it should call the providers to modify the object properly', () => {
            service.setPaymentsDigitalData();
            expect( fakeDigitalDataService.getDigitalData ).toHaveBeenCalled();
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
            expect( fakeAJSDatalayerUtilsService.setProcessAndStep ).toHaveBeenCalled();
            expect( fakeDigitalDataUtilsService.updateDigitalDataWithQuadrigam ).toHaveBeenCalled();
        } );
    });
    describe( 'When setOnHoldDigitalData is called', () => {
        it( 'it should call providers to modify the object properly', () => {
            service.setOnHoldDigitalData();
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
            expect( fakeAJSDatalayerUtilsService.setProcessAndStep ).toHaveBeenCalled();
            expect( fakeDigitalDataUtilsService.updateDigitalDataWithQuadrigam ).toHaveBeenCalled();
        } );
    } );
    describe( 'When manageDigitalDataVoucher is called', () => {
        it( 'it should call provider to set digital_data info with voucherInfo', () => {
            service.manageDigitalDataVoucher( <VoucherDiscountOrder>{} );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
        } );
        it( 'it should call provider to set digital_data without voucherInfo', () => {
            service.manageDigitalDataVoucher( undefined );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
        } );
    } );
    describe( 'When setDigitalDataPmtType is called', () => {
        it( 'it should set type with credit card and call provider', () => {
            service.setDigitalDataPmtType( <OnPaymentSuccessEvent> { methodType: 'CREDIT_CARD', details: { creditCardType: 'VI' } } );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
        } );
        it( 'it should set type with method type and call provider', () => {
            service.setDigitalDataPmtType( <OnPaymentSuccessEvent> { methodType: 'FREE' } );
            expect( fakeDigitalDataService.addDigitalDataInfo ).toHaveBeenCalled();
        } );
        it( 'it should return with no digital_data finded', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( undefined );
            service.setDigitalDataPmtType( <OnPaymentSuccessEvent> { methodType: 'FREE' } );
            expect( fakeDigitalDataService.addDigitalDataInfo ).not.toHaveBeenCalled();
        } );
    } );
    describe( 'When setAncillariesDatalayer is called', () => {
        it( 'it should call provider', () => {
            service.setAncillariesDatalayer();
            expect( fakeAJSDatalayerUtilsService.setAncillariesDatalayer ).toHaveBeenCalled();
        } );
    } );
    describe( 'When setConfirmationInfo is called', () => {
        it( 'it should call providers and set on sessionStorage', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( {} );
            service.setConfirmationInfo();
            expect( fakeAJSDatalayerUtilsService.setProcessAndStep ).toHaveBeenCalled();
            const confInfo = fakeSessionStorageService.get( BkiStorageConstants.CONFIRM_DIGITALDATA_INFO );
            expect( confInfo ).toEqual( {} );
        } );
    } );
    describe( 'When addEcommerceEvent is called', () => {
        it( 'it should call provider method', () => {
            fakeSessionStorageService.set( 'addToCart', { ecommerce: {} } );
            service.addEcommerceEvent();
            expect( fakeDigitalDataService.addDigitalDataEcommerceEvent ).toHaveBeenCalled();
        } );
    } );
    describe( 'When setDigitalDataVoucherShown and digital_data is undefined', () => {
        it( 'it should return ', () => {
            fakeDigitalDataService.getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( undefined );
            service.setDigitalDataVoucherShown();
            expect( fakeDigitalDataService.addDigitalDataInfo ).not.toHaveBeenCalled();
        } );
    });
    describe('When getPaymentPageQuadrigam is called', () => {
        it('should return BKI_PAYMENTS_COH_NEW when process is ONHOLD_CONFIRMATION', () => {
            spyOn(service, 'getDigitalDataProcess').and.returnValue(DigitalDataProcess.ONHOLD_CONFIRMATION);

            const quadrigam = service.getPaymentPageQuadrigam();

            expect(quadrigam).toEqual(BookingAppConstants.QUADRIGAMS.BKI_PAYMENTS_COH_NEW);
        });

        it('should return BKI_PAYMENTS_NEW when process is not ONHOLD_CONFIRMATION', () => {
            spyOn(service, 'getDigitalDataProcess').and.returnValue(DigitalDataProcess.BOOKING_SLICED);

            const quadrigam = service.getPaymentPageQuadrigam();

            expect(quadrigam).toEqual(BookingAppConstants.QUADRIGAMS.BKI_PAYMENTS_NEW);
        });
    });

});