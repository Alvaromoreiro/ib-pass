import { InjectionToken } from '@angular/core';
import { CallApisFormService } from '@src/components/ib-reusable-components/ib-http-services/trm-apim/services/ib-call-apis-form-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCallApisFormService = new InjectionToken<CallApisFormService>('CallApisFormService');
export const AJSCallApisFormServiceProvider = upgradeAJSServiceProvider('CallApisFormService', AJSCallApisFormService);
export interface AJSCallApisFormServiceType extends CallApisFormService { }