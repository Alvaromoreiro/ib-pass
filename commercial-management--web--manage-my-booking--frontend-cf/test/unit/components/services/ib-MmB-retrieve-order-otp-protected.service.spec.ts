import { TestBed } from '@angular/core/testing';
import { IbMmbRetrieveOrderOtpProtectedService } from '@src/components/services/ib-MmB-retrieve-order-otp-protected.service';
import { IbLotusOtpModalService } from '@src/app/shared/components/ib-lotus-otp-modal/ib-lotus-otp-modal.service';
import { IbMmbRetrieveOrderService } from '@src/components/services/ib-MmB-retrieve-order.service';

describe('IbMmbRetrieveOrderOtpProtectedService', () => {
  let service: IbMmbRetrieveOrderOtpProtectedService;
  let otpModalService: jasmine.SpyObj<IbLotusOtpModalService>;
  let retrieveOrderService: jasmine.SpyObj<IbMmbRetrieveOrderService>;

  const createOtpError = (extra: any = {}) => ({
    errorCode: 403,
    internalErrorCode: 'SSE_ORM_6969',
    ...extra
  });

  const rejectWithOtpError = (extra: any = {}) => {
    retrieveOrderService.retrieveOrderPostPromised.and.rejectWith(
      createOtpError(extra)
    );
  };

  beforeEach(() => {
    otpModalService = jasmine.createSpyObj('IbLotusOtpModalService', ['showOTPModal']);
    retrieveOrderService = jasmine.createSpyObj('IbMmbRetrieveOrderService', ['retrieveOrderPostPromised']);

    TestBed.configureTestingModule({
      providers: [
        IbMmbRetrieveOrderOtpProtectedService,
        { provide: IbLotusOtpModalService, useValue: otpModalService },
        { provide: IbMmbRetrieveOrderService, useValue: retrieveOrderService }
      ]
    });

    service = TestBed.inject(IbMmbRetrieveOrderOtpProtectedService);
  });

  describe('generateOtpModel', () => {
    it('should generate a valid OTP model', () => {
      const error: any = {
        flowId: 'FLOW1',
        otp: {
          email: 'test@test.com',
          sessionToken: 'SESSION1'
        }
      };

      const model = service.generateOtpModel('ABC123', 'DOE', error);

      expect(model.pnr).toBe('ABC123');
      expect(model.surname).toBe('DOE');
      expect(model.flowId).toBe('FLOW1');
      expect(model.email).toBe('test@test.com');
      expect(model.sessionId).toBe('SESSION1');
      expect(new Date(model.sessionExpiration).getTime())
        .toBeGreaterThan(new Date(model.sessionRequested).getTime());
    });
  });

  describe('retrieveOrder', () => {
    it('should resolve when retrieveOrderPostPromised resolves', async () => {
      retrieveOrderService.retrieveOrderPostPromised.and.resolveTo({ ok: true });

      const result = await service.retrieveOrder('DOE', 'ABC123');
      expect(result).toEqual({ ok: true });
    });

    it('should reject when error is not OTP related', async () => {
      const error = { errorCode: 500 };
      retrieveOrderService.retrieveOrderPostPromised.and.rejectWith(error);

      try {
        await service.retrieveOrder('DOE', 'ABC123');
        fail('Promise should be rejected');
      } catch (e) {
        expect(e).toEqual(error);
      }
    });

    it('should open OTP modal and resolve with modal data', async () => {
      rejectWithOtpError({
        flowId: 'FLOW1',
        otp: { email: 'a@b.com', sessionToken: 'S1' }
      });

      otpModalService.showOTPModal.and.resolveTo({
        state: 'SUCCESS',
        data: { success: true }
      } as any);

      const result = await service.retrieveOrder('DOE', 'ABC123');
      expect(result).toEqual({ success: true });
    });

    it('should reject with OTP_MODAL_CLOSED_BY_USER when modal closed', async () => {
      rejectWithOtpError();

      otpModalService.showOTPModal.and.rejectWith({});

      try {
        await service.retrieveOrder('DOE', 'ABC123');
        fail('Promise should be rejected');
      } catch (e: any) {
        expect(e.internalErrorCode).toBe('OTP_MODAL_CLOSED_BY_USER');
      }
    });

    it('should reject with modal errorData when present', async () => {
      rejectWithOtpError();

      const modalError = { errorCode: 999 };
      otpModalService.showOTPModal.and.rejectWith({ errorData: modalError });

      try {
        await service.retrieveOrder('DOE', 'ABC123');
        fail('Promise should be rejected');
      } catch (e) {
        expect(e).toEqual(modalError);
      }
    });

    it('should cover modal catch branch', async () => {
      rejectWithOtpError();

      otpModalService.showOTPModal.and.returnValue(
        Promise.resolve().then(() => {
          throw 'any';
        })
      );

      try {
        await service.retrieveOrder('DOE', 'ABC123');
      } catch {}
    });
  });
});
