import { HttpRequest } from '@angular/common/http';



const AkamaiCustomEventName = 'ak_cpr_chlg_init';

export const launchAkamaiMessage = (res: HttpRequest<unknown>) => {
    
    const akamaiCustomEvent = new CustomEvent(AkamaiCustomEventName, {
        detail: {
            res: res,
            url: res.url
        }
    });
    window.dispatchEvent(akamaiCustomEvent);
};
