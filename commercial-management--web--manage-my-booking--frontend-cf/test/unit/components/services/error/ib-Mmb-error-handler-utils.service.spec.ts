import { TestBed } from '@angular/core/testing';
import { IbMmbErrorHandlerUtilsService } from '@src/components/services/error/ib-Mmb-error-handler-utils.service';
import {
  MmbServiceErrorMessages
} from '@src/app/core/models/general-errors-model';
import { MmbCommonsErrorDataGeneral } from '@src/app/core/models/general-errors-model';

describe('IbMmbErrorHandlerUtilsService', () => {
  let service: IbMmbErrorHandlerUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IbMmbErrorHandlerUtilsService]
    });
    service = TestBed.inject(IbMmbErrorHandlerUtilsService);
  });

  const baseError = (overrides?: Partial<MmbCommonsErrorDataGeneral>): MmbCommonsErrorDataGeneral =>
    ({
      errorCode: 400,
      requestURL: '/test',
      data: {
        errors: [{ reason: 'GENERIC_REASON', code: 'E001' }]
      },
      ...overrides
    } as any);

  const expectSingleError = (
    result: any,
    message: string,
    code: string,
    needsTranslate?: boolean
  ) => {
    expect(result.message).toBe(message);
    expect(result.internalErrorCode).toBe(code);
    if (typeof needsTranslate === 'boolean') {
      expect(result.needsTranslate).toBe(needsTranslate);
    }
    expect(result.messageList).toBeUndefined();
  };

  const runSingleErrorTest = (
    title: string,
    reason: string,
    code: string,
    options?: {
      usePrivateMethod?: boolean;
      expectedMessage?: string;
      needsTranslate?: boolean;
    }
  ) => {
    it(title, () => {
      const error = baseError({
        data: { errors: [{ reason, code }] }
      });

      const result = options?.usePrivateMethod
        ? (service as any).processGeneralErrorWithProperties(error)
        : service.controlError(error);

      expectSingleError(
        result,
        options?.expectedMessage ?? reason,
        code,
        options?.needsTranslate
      );
    });
  };

  it('processes generic error', () => {
    const result = service.controlError(baseError());
    expectSingleError(result, 'GENERIC_REASON', 'E001');
  });

  it('processes non-400 error', () => {
    const result = service.controlError(baseError({ errorCode: 500 }));
    expect(result.errorCode).toBe(500);
  });

  [
    {
      reason: MmbServiceErrorMessages.JSON_MAPPING_EXCEPTION,
      translate: false
    },
    {
      reason: MmbServiceErrorMessages.UNEXPECTED_TECHNICAL_EXCEPTION,
      translate: false
    },
    {
      reason: MmbServiceErrorMessages.FARE_NOT_FOUND,
      translate: false
    },
    {
      reason: MmbServiceErrorMessages.PAC_UTILS_E0001,
      translate: true,
      expected: MmbServiceErrorMessages.SERVICEGENERALERROR
    }
  ].forEach(({ reason, translate, expected }) => {
    runSingleErrorTest(
      `service error message: ${reason}`,
      reason,
      'ECODE',
      {
        expectedMessage: expected ?? reason,
        needsTranslate: translate
      }
    );
  });

  runSingleErrorTest(
    'single error: SIMPLE_REASON',
    'SINGLE_REASON',
    'SINGLE_CODE'
  );

  runSingleErrorTest(
    'single error: BACKEND_TECH_ERROR',
    'BACKEND_TECH_ERROR',
    'B001'
  );

  runSingleErrorTest(
    'single error: BACKEND_GENERIC_ERROR',
    'BACKEND_GENERIC_ERROR',
    'E_GENERIC',
    { needsTranslate: false }
  );

  runSingleErrorTest(
    'single error: NO_PROPERTY_REASON via private method',
    'NO_PROPERTY_REASON',
    'NO_PROP_CODE',
    { usePrivateMethod: true }
  );

  runSingleErrorTest(
    'single error: property pattern via private method',
    'property:test|error:FORCED',
    'FORCED_CODE',
    { usePrivateMethod: true, expectedMessage: 'FORCED' }
  );

  it('handles multiple errors', () => {
    const result = service.controlError(
      baseError({
        data: {
          errors: [
            { reason: 'property:test|error:FIRST', code: 'E1' },
            { reason: 'SECOND_REASON', code: 'E2' }
          ]
        }
      })
    );

    expect(result.messageList?.length).toBe(2);
    expect(result.messageList?.[0]).toEqual(
      jasmine.objectContaining({ message: 'FIRST', internalErrorCode: 'E1' })
    );
    expect(result.messageList?.[1]).toEqual(
      jasmine.objectContaining({ message: 'SECOND_REASON', internalErrorCode: 'E2' })
    );
  });

  it('falls back when no errors exist', () => {
    const result = (service as any).processGeneralErrorWithProperties(
      baseError({ data: { errors: [] } })
    );

    expect(result.message).toBe(MmbServiceErrorMessages.SERVICEGENERALERROR);
    expect(result.needsTranslate).toBeTrue();
  });

  it('uses legacy error code when present', () => {
    const result = service.controlError(
      baseError({ data: { error: { code: 'LEGACY_CODE' } } as any })
    );
    expect(result.internalErrorCode).toBe('LEGACY_CODE');
  });
});
