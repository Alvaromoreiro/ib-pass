import { TestBed } from '@angular/core/testing';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { OtpModalModel, OtpModalOutput } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-otp-model';
import { IbLotusOtpModalService } from './ib-lotus-otp-modal.service';
import { IbLotusOtpModalComponent } from './ib-lotus-otp-modal.component';

describe('IbLotusOtpModalService', () => {
    let service: IbLotusOtpModalService;
    let mockModalService: jasmine.SpyObj<IbCModalService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('IbCModalService', ['showGenericComponentModal']);

        TestBed.configureTestingModule({
            providers: [
                IbLotusOtpModalService,
                { provide: IbCModalService, useValue: spy }
            ]
        });

        service = TestBed.inject(IbLotusOtpModalService);
        mockModalService = TestBed.inject(IbCModalService) as jasmine.SpyObj<IbCModalService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show OTP modal and return result', async () => {
        const mockModalRef = jasmine.createSpyObj('IbModalRef', ['close', 'dismiss'], {
            componentInstance: {
                voucherCode: '123456',
                flowId: '12345',
                sessionId: 'SDFLÑKJASDFLKW345234',
                sessionExpiration: 'EXPIRATION',
                sessionRequested: 'REQUESTED',
                email: 'PEPE@PEPE.COM'
            },
            result: Promise.resolve({ success: true, state: 'SUCCESS', sessionId: '12345' } as OtpModalOutput)
        });

        mockModalService.showGenericComponentModal.and.returnValue(mockModalRef);

        const viewModel: OtpModalModel = {
            voucherCode: '123456',
            flowId: '12345',
            sessionId: 'SDFLÑKJASDFLKW345234',
            sessionExpiration: 'EXPIRATION',
            sessionRequested: 'REQUESTED',
            email: 'PEPE@PEPE.COM'
        };
        const result = await service.showOTPModal(viewModel);

        expect(mockModalService.showGenericComponentModal).toHaveBeenCalledWith(
            IbLotusOtpModalComponent,
            service.modalOptions
        );
        expect(mockModalRef.componentInstance.model).toBe(viewModel);
        expect(result).toEqual(jasmine.objectContaining({ state: 'SUCCESS', sessionId: '12345' }));
    });
});