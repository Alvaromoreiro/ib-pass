import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { IbCHeadersInterceptorService } from "./ib-commons-header-interceptor.service";
import { IbCAuthInterceptorService } from "./ib-commons-auth-interceptor.service";
import { IbCRetryInterceptorService } from "./ib-commons-retry-interceptor.service";
import { IbCRestrictedInterceptorService } from "./ib-commons-restricted-interceptor.service";

export const IbCommonGenericInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IbCHeadersInterceptorService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IbCAuthInterceptorService,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IbCRetryInterceptorService,
    multi: true,
  },
];

export const IbCommonGenericRestrictedInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: IbCRestrictedInterceptorService,
    multi: true,
  },
  ...IbCommonGenericInterceptorProvider,
];
