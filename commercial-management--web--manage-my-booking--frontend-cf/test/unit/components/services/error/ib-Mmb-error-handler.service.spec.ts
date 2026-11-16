import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { IbMmbErrorHandlerService } from '@src/components/services/error/ib-Mmb-error-handler.service';
import { IbMmbErrorHandlerUtilsService } from '@src/components/services/error/ib-Mmb-error-handler-utils.service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { MmbCommonsErrorsResponseGeneral } from '@src/app/core/models/general-errors-model';
import { MmbHttpErrorModel } from '@src/app/core/models/generic-models';

describe('IbMmbErrorHandlerService', () => {
  let service: IbMmbErrorHandlerService;
  let utilsService: jasmine.SpyObj<IbMmbErrorHandlerUtilsService>;

  beforeEach(() => {
    const utilsSpy = jasmine.createSpyObj('IbMmbErrorHandlerUtilsService', [
      'controlError'
    ]);

    TestBed.configureTestingModule({
      providers: [
        IbMmbErrorHandlerService,
        { provide: IbMmbErrorHandlerUtilsService, useValue: utilsSpy }
      ]
    });

    service = TestBed.inject(IbMmbErrorHandlerService);
    utilsService = TestBed.inject(
      IbMmbErrorHandlerUtilsService
    ) as jasmine.SpyObj<IbMmbErrorHandlerUtilsService>;
  });

  const mockParentGetErrorMessage = (errorModel: Partial<MmbHttpErrorModel>) => {
    spyOn(
      IbCHttpErrorHandlerService.prototype as any,
      'getErrorMessage'
    ).and.returnValue([errorModel]);
  };

  it('should throw legacy error processed by utils service', (done) => {
    const angularError = new HttpErrorResponse({
      status: 500,
      url: '/test-url',
      error: { errors: [{ code: 'ERR' }] }
    });

    const baseError: Partial<MmbHttpErrorModel> = {};
    const controlledError = {} as MmbCommonsErrorsResponseGeneral;

    mockParentGetErrorMessage(baseError);
    utilsService.controlError.and.returnValue(controlledError);

    service['handleGenericError'](angularError).subscribe({
      error: (err) => {
        expect(err).toBe(controlledError);
        expect(baseError.errorCode).toBe(500);
        expect(baseError.requestURL).toBe('/test-url');
        expect(baseError.data).toEqual(angularError.error);
        expect(utilsService.controlError).toHaveBeenCalledWith(
          baseError as MmbHttpErrorModel
        );
        done();
      }
    });
  });

  it('should return undefined data when angular error has no error property', () => {
    const angularError = new HttpErrorResponse({
      status: 400,
      url: '/no-error',
      error: null
    });

    const baseError: Partial<MmbHttpErrorModel> = {};
    mockParentGetErrorMessage(baseError);

    utilsService.controlError.and.returnValue(
      {} as MmbCommonsErrorsResponseGeneral
    );

    try {
      service['handleGenericError'](angularError).subscribe({
        error: () => {}
      });
    } catch {}

    expect(baseError.data).toBeUndefined();
  });

  it('should wrap error when err.error has no errors property', () => {
    const angularError = new HttpErrorResponse({
      status: 404,
      url: '/wrapped-error',
      error: { message: 'Not found' }
    });

    const baseError: Partial<MmbHttpErrorModel> = {};
    mockParentGetErrorMessage(baseError);

    utilsService.controlError.and.returnValue(
      {} as MmbCommonsErrorsResponseGeneral
    );

    try {
      service['handleGenericError'](angularError).subscribe({
        error: () => {}
      });
    } catch {}

    expect(baseError.data).toEqual({
      error: angularError.error
    });
  });

  it('should return raw data when err.error.errors exists', () => {
    const angularError = new HttpErrorResponse({
      status: 401,
      url: '/raw-error',
      error: { errors: [{ code: 'AUTH' }] }
    });

    const baseError: Partial<MmbHttpErrorModel> = {};
    mockParentGetErrorMessage(baseError);

    utilsService.controlError.and.returnValue(
      {} as MmbCommonsErrorsResponseGeneral
    );

    try {
      service['handleGenericError'](angularError).subscribe({
        error: () => {}
      });
    } catch {}

    expect(baseError.data).toBe(angularError.error);
  });
});
