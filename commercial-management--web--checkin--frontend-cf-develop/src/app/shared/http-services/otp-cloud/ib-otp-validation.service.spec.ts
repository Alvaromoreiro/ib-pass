import { OtpValidationService } from './ib-otp-validation.service';
import { of, throwError } from 'rxjs';
import { IbCBaseRestService } from 'ib-web-commons/proxies';
import { IRootScopeExt } from '@src/app/core/models/generic-models/generic-models';

describe('OtpValidationService', () => {
    let service: OtpValidationService;
    let proxy: jasmine.SpyObj<IbCBaseRestService>;
    let rootScope: Pick<IRootScopeExt, 'otpServicesURI'>;

    beforeEach(() => {
        proxy = jasmine.createSpyObj<IbCBaseRestService>('IbCBaseRestService', ['post']);
        rootScope = { otpServicesURI: '/api' };
        service = new OtpValidationService(proxy, rootScope);
    });

    it('sends the OTP validation request with its session headers', async () => {
        const response = { data: { otp_code: '123456' } };
        proxy.post.and.returnValue(of(response) as unknown as ReturnType<typeof proxy.post>);

        const result = await service.validate({ otpCode: '123456', sessionToken: 'session-token' });

        expect(proxy.post).toHaveBeenCalledWith(
            '/api/otp/validate',
            { data: { otpCode: '123456' } },
            { headers: { 'session_token': 'session-token', 'Referrer-Policy': 'strict-origin' } }
        );
        expect(result).toBe(response);
    });

    it('rejects with the first OTP error from the HTTP response metadata', async () => {
        const otpError = { code: 'OTP_INVALID', message: 'The OTP is invalid' };
        const httpError = { error: { metadata: { errors: [otpError] } } };
        proxy.post.and.returnValue(throwError(() => httpError));

        await expectAsync(service.validate({ otpCode: '000000', sessionToken: 'session-token' }))
            .toBeRejectedWith(otpError);
    });
});