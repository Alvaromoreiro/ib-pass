import { TestBed } from '@angular/core/testing';
import { OtpValidationService } from '@shared/http-services/otp-cloud/ib-otp-validation.service';
import { IbCBaseRestService } from 'ib-web-commons/proxies';
import { AJSRootScope } from 'ib-web-commons/utils';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('OtpValidationService', () => {
    let service: OtpValidationService;
    let proxy: jasmine.SpyObj<IbCBaseRestService>;
    let $rootScope: any;

    beforeEach(() => {
        const proxySpy = jasmine.createSpyObj('IbCBaseRestService', ['post']);
        $rootScope = { otpServicesURI: 'http://example.com/' };

        TestBed.configureTestingModule({
            providers: [
                OtpValidationService,
                { provide: IbCBaseRestService, useValue: proxySpy },
                { provide: AJSRootScope, useValue: $rootScope }
            ]
        });

        service = TestBed.inject(OtpValidationService);
        proxy = TestBed.inject(IbCBaseRestService) as jasmine.SpyObj<IbCBaseRestService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should validate OTP successfully', async () => {
        const otpParams = { otpCode: '123456', sessionToken: 'token123' };
        const response = { data: { success: true } };
        proxy.post.and.returnValue(of(response as any));

        const result = await service.validate(otpParams);
        expect(result).toEqual(response);
    });

    it('should throw an error when OTP validation fails', async () => {
        const otpParams = { otpCode: '123456', sessionToken: 'token123' };
        const errorResponse = new HttpErrorResponse({
            error: { metadata: { errors: ['Invalid OTP'] } },
            status: 400,
            statusText: 'Bad Request'
        });
        proxy.post.and.returnValue(throwError(errorResponse));

        try {
            await service.validate(otpParams);
            fail('Expected an error to be thrown');
        } catch (error) {
            expect(error).toBe('Invalid OTP');
        }
    });
});
