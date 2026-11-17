import { loginIBPlus } from '../general/ibe_login';
const event = new CustomEvent('IDENTITY_LOGIN_ONPAGE'); 
window.parent.dispatchEvent(event);
dFrontJs.ibe_loading.open();
loginIBPlus.call({ callerID: 'WCS' });
