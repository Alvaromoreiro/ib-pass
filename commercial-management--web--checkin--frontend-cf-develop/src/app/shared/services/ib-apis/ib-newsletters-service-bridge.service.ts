import { InjectionToken } from '@angular/core';
import { NewslettersService } from '@src/components/ib-reusable-components/ib-http-services/cust-cust/services/ib-newsletters-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSNewslettersService = new InjectionToken<NewslettersService>('NewslettersService');
export const AJSNewslettersServiceProvider = upgradeAJSServiceProvider('NewslettersService', AJSNewslettersService);
export interface AJSNewslettersServiceType extends NewslettersService { }